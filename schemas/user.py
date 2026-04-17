from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    username : str
    email : EmailStr
    password : str
    
class UserLogin(BaseModel):
    username : str    
    password : str

class UsuarioUpdate(BaseModel):
    username : str | None = None
    password : str | None = None
    activo : str | None = None