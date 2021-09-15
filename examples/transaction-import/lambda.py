from io import BytesIO
import os
from pathlib import Path
from datetime import datetime
import urllib.parse
import codecs
import boto3
from logging import getLogger

log = getLogger(__name__)

from transaction_importer import TransactionImporter

def get_key() -> str:
    # allow passing the key as a json string or as a path to a file containing the key
    private_key = os.environ.get('PRIVATE_KEY')
    if private_key:
        if Path(private_key).is_file():
            log.debug("Reading private key from file {}", private_key)
            with open(private_key, 'rt', encoding='utf-8') as f:
                return f.read()
        else:
            return private_key

    # No key passed directly check for AWS secret
    private_key_secret = os.environ['PRIVATE_KEY_SECRET']
    aws_region = os.environ.get("AWS_REGION")
    if not aws_region:
        raise Exception("AWS region not provided")

    log.debug("Reading private key from AWS secret {}", private_key_secret)
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=aws_region,
    )

    get_secret_value = client.get_secret_value(
        SecretId=private_key_secret
    )
    private_key = get_secret_value['SecretString']

    return private_key


def handler(event, context):

    private_key = get_key()
    if not private_key:
        log.error("Private key not provided")
        return

    api_base_url = os.environ.get("PTI_API_BASE_URL")
    if not api_base_url:
        log.error("API base url not provided, please set PTI_API_BASE_URL")
        return

    client_id = os.environ.get("PTI_CLIENT_ID")
    if not client_id:
        log.error("Client ID not provided, please set PTI_CLIENT_ID")
        return

    aws_region = os.environ.get("AWS_REGION")
    if not aws_region:
        log.error("Client ID not provided, please set AWS_REGION")

    # load object specified in event from S3
    s3_client = boto3.client('s3', region_name=aws_region)
    source_bucket = event['Records'][0]['s3']['bucket']['name']
    source_object_key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    log.debug("Loading S3 object {}/{}", source_bucket, source_object_key)
    try:
        response = s3_client.get_object(Bucket=source_bucket, Key=source_object_key)
    except Exception as e:
        log.error("Could not load S3 object {}/{}", source_bucket, source_object_key)
        return

    # create result bucket
    result_bucket_name = datetime.now().isoformat().replace(":", ".")
    location = {'LocationConstraint': aws_region}
    log.debug("Creating S3 result bucket {}", result_bucket_name)
    resp = s3_client.create_bucket(Bucket=result_bucket_name,
                            CreateBucketConfiguration=location)

    source_object = f"{source_bucket}/{source_object_key}"
    log.debug("Copying S3 object {} to result bucket {}", source_object, result_bucket_name)
    resp = s3_client.copy_object(CopySource=f"{source_bucket}/{source_object_key}", Bucket=result_bucket_name, Key=source_object_key)

    importer = TransactionImporter()

    log.debug("Getting S3 object {}/{}", result_bucket_name, source_object_key)
    resp = s3_client.get_object(Bucket=result_bucket_name, Key=source_object_key)

    # load transactions json
    stream = codecs.getreader("utf-8")(resp["Body"])
    importer = TransactionImporter()
    importer.load_from_json_stream(stream)

    # call api for all valid transactions
    importer.log_transactions_via_api(client_id=client_id, api_base_url=api_base_url)
    # create result report
    status_suffix = "errors" if importer.has_errors else "ok"
    object_without_ext = Path(source_object_key).with_suffix('')
    result_filename = f"{object_without_ext}.{status_suffix}.json"

    result_stream = BytesIO(importer.errors.json().encode("utf-8"))

    resp = s3_client.upload_fileobj(Fileobj=result_stream, Bucket=result_bucket_name, Key=result_filename)
