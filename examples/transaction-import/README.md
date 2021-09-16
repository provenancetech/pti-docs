## Transaction import example

This directory contains Python code that allows you to
* Convert a .csv file to a .json transaction file with all the needed information to perform POST API calls to the `/users/{user_id}/transactionLogs` endpoint
* Call the api to log the transactions contained in a .json transaction file

### Local installation

This code requires Python 3.8 or later to be installed. To manage multiple Python versions locally, use [pyenv](https://github.com/pyenv/pyenv).

Dependency management is done using [poetry](https://python-poetry.org/), but a requirements.txt is also provided to allow the usage of pip directly.

Setup your the python version for this project:

```shell
pyenv local 3.8.12
```

To install dependencies within a virtualenv with poetry:

```shell
poetry install
```

### Running the transaction importer

Run the following command to get the usage information
```shell
python transaction_importer.py -h
```

This will output a usage information similar to this:
```text
 Transaction Importer

Usage:
    transaction_importer.py convert CSV_INPUT_FILE JSON_OUTPUT_FILE
    transaction_importer.py import --input=<json_input_file> --client_id=<client_id> --private_key=<pk_file> --endpoint=<api_endpoint>
    transaction_importer.py -h | --help

Arguments:
    CSV_INPUT_FILE      csv input file to convert to json
    JSON_OUTPUT_FILE    name of the json ouptut file containing the result of the conversion

Options
    -h --help       Show this screen
    --input         Path to json input to use for importation
    --client_id     Client ID to be used for importation calls to the API
    --private_key   Path to a private key file in json format to be used to sign API requests
    --endpoint      Root endpoint of the API
```
If errors are detected, a file ending with `.errors.json` will be produced with the details of the errors.

#### Limitations

For the moment, only withdrawals to token addresses are supported in terms of transaction types. 
