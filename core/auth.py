from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

SECRET_KEY = "Abc123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def encriptar_password(password : str):
    return pwd_context.hash(password)

def verificar_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password,hashed_password)

def crear_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp":expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

def verificar_token(token : str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token Invalido")
        return username
    except JWTError:
        raise HTTPException(status_code=401,detail="Token Invalido o Expirado")