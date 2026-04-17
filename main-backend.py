from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import mysql.connector
from core.conexion import con
from schemas.user import Usuario, UsuarioUpdate, UserLogin
from fastapi.middleware.cors import CORSMiddleware
from core.auth import encriptar_password,verificar_password,crear_token,verificar_token
import bcrypt

# Crear app con CORS habilitado
app = FastAPI(title="API Usuarios con JWT")

# Configuración de CORS
origins = [
    "http://127.0.0.1:5501",       # Live Server frontend
    "http://localhost:5501",        # Alternative localhost
    "http://127.0.0.1:8000",        # Backend (si es necesario)
    "http://localhost:8000",        # Alternative backend
]

# Registrar middleware CORS - DEBE SER EL PRIMERO
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Exponer todos los headers en la respuesta
)

@app.post("/register")
async def create_user(user : Usuario):
    cursor = con.cursor()
    hashed =  encriptar_password(user.password)

    query = "INSERT INTO tbl_users (username,email,password) VALUES (%s,%s,%s)"
    value = (user.username, user.email, hashed)
    
    try:
        cursor.execute(query,value)
        con.commit()
        token = crear_token({"sub": user.username}) 
        return {'mensaje': "Usuario registrado con exito", "token": token, "username":user.username}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500,detail=f"Error al registrar usuario: {err}")
    finally:
        cursor.close()

def verificar_password(password_plano : str, hash_guardado: str) -> bool:
    try:
        hash_guardado = hash_guardado.strip()
        password_plano = password_plano[:72]
        return bcrypt.checkpw(password_plano.encode('utf-8'),hash_guardado.encode('utf-8'))
    except Exception as e:
        print(f"Error al verificar la clave: {e}")
        return False

@app.post('/login')
async def listar_usuario(user: UserLogin):
    cursor = con.cursor(dictionary=True)
    query = "SELECT username, password FROM tbl_users WHERE username = %s"

    try:
        cursor.execute(query, (user.username,))
        usuario = cursor.fetchone()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        
        contraseña_valida = verificar_password(user.password, usuario['password'])
        
        if contraseña_valida: 
            token = crear_token({"sub": user.username})            
            return {"message": "Inicio de sesion correcto.", "token": token, "username": user.username}                       
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {err}")
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {err}")
    finally:
        cursor.close()

@app.get('/verify')
async def verify_token(token: str = Depends(verificar_token)):
    return {"message": "Token válido", "username": token}


@app.get('/user', dependencies=[Depends(verificar_token)])
async def listar_usuario():
    cursor = con.cursor(dictionary=True)
    query = "SELECT username FROM tbl_users WHERE username = %s"

    try:
        cursor.execute(query)
        usuarios = cursor.fetchall()
        return usuarios
    except mysql.connector.Error:
        raise HTTPException(status_code=500,detail="Error al listar usuarios")
    finally:
        cursor.close()


# @app.post('/usuarios/')
# async def crear_usuario(usu :  Usuario):
#     cursor = con.cursor()
#     hashed =  encriptar_password(usu.password)

#     query = "INSERT INTO tbl_users (usu_codigo,usu_password,usu_activo) VALUES (%s,%s,%s)"
#     value = (usu.username,hashed,usu.activo)

#     try:
#         cursor.execute(query,value)
#         con.commit()
#         return {'mensaje': "Usuario registrado con exito"}
#     except mysql.connector.Error as err:
#         raise HTTPException(status_code=500,detail=f"Error al registrar usuario: {err}")
#     finally:
#         cursor.close()

# def verificar_password(password_plano : str, hash_guardado: str) -> bool:
#     try:
#         hash_guardado = hash_guardado.strip()
#         password_plano = password_plano[:72]
#         return bcrypt.checkpw(password_plano.encode('utf-8'),hash_guardado.encode('utf-8'))
#     except Exception as e:
#         print(f"Error al verificar la clave: {e}")
#         return False
    
# @app.post("/login")
# async def login(form_data:OAuth2PasswordRequestForm = Depends()):
#     try:
#         cursor = con.cursor(dictionary=True)
#         query = "SELECT * FROM tbl_usuario WHERE usu_codigo=%s"
#         cursor.execute(query,(form_data.username,))
#         user = cursor.fetchone()
#         cursor.close()

#         if not user:
#             raise HTTPException(status_code=404,detail="Usuario no encontrado")
#         if 'usu_password' not in user:
#             raise HTTPException(status_code=500,detail="Campo usu_password no encontrado en la tabla")
#         if not verificar_password(form_data.password,user['usu_password']):
#             raise HTTPException(status_code=401,detail="Clave incorrecta")
        
#         token = crear_token({"sub":user['usu_codigo']})
#         return {'access_token' : token, "token_type": "bearer"}
#     except mysql.connector.Error as err:
#         raise HTTPException(status_code=500,detail=f"Error en BD {err}")
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500,detail=f"Error inesperado {e}")
    
# @app.get('/usuarios/', dependencies=[Depends(verificar_token)])
# async def listar_usuario():
#     cursor = con.cursor(dictionary=True)
#     query = "SELECT * FROM tbl_usuario"

#     try:
#         cursor.execute(query)
#         usuarios = cursor.fetchall()
#         return usuarios
#     except mysql.connector.Error:
#         raise HTTPException(status_code=500,detail="Error al listar usuarios")
#     finally:
#         cursor.close()