import sys
import uuid
from jwcrypto import jwk

def generate_credentials(client_name: str):
    if not client_name:
        print("ERROR: you must provide a client name")
        return

    key = jwk.JWK.generate(kty='RSA', size=4096, kid=str(uuid.uuid4()))
    with open(f"{client_name}_private_key.jwk", "w") as f:
        f.write(key.export(private_key=True))
    with open(f"{client_name}_public_key.jwk", "w") as f:
        f.write(key.export_public())


if __name__ == "__main__":
    generate_credentials(sys.argv[1])
