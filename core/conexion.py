import mysql.connector

conexion_config = {
    # "database": "blihx6c39wt3ahnyovl3",
    # "host":"2blihx6c39wt3ahnyovl3-mysql.services.clever-cloud.com",
    # "user":"u2djhmyl55xnmgaj",
    # "password":"u2djhmyl55xnmgaj",
    # "port": 3306    
    "database": "dbtestjehs",
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "port": 3306
}

try:
    con = mysql.connector.connect(**conexion_config)
    print("Conexion Exitosa")
except mysql.connector.Error as err:
    print(f"Error de conexion: {err}")
    con = None

def get_conexion():
    return con