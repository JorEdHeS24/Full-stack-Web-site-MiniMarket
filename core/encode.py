import mysql.connector
import bcrypt
mysql_config = {
    'user' : 'cul20252',
    'password' : 'Cul2025*',
    'host' : '186.170.30.156',
    'database' : 'cul_backend',
    'port' : 3306
}

try:
    con = mysql.connector.connect(**mysql_config)
    print("Conexion Exitosa")
except mysql.connector.Error as err:
    print("Error de conexion: {err}")
    con = None

def get_conexion():
    return con

def encriptar_password(password : str) -> str :
    password = password[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def actualizar_clave(usuario: str, nueva_clave : str):
    conexion = get_conexion()
    cursor = conexion.cursor()
    hashed = encriptar_password(nueva_clave)

    sql= "UPDATE tbl_usuario SET usu_password= %s WHERE usu_codigo= %s"
    cursor.execute(sql,(hashed,usuario))
    conexion.commit()
    print(f"Clave Actualizada para '{usuario}'. Hash generado ")
    print(hashed)

    cursor.close()
    conexion.close()

if __name__ == "__main__":
    usuario = input("Nombre de usuario: ").strip()
    clave = input("Clave de usuario: ").strip()
    actualizar_clave(usuario, clave)