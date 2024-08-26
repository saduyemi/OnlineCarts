from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Setting up connection pool
conn = psycopg2.connect(
    database="postgres-local",
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT')
)
conn.autocommit = True

cursor = conn.cursor()

@app.route('/', methods=['GET'])
def Home():
    return (jsonify({"message": "Server Is Running"}), 200)

@app.route('/create_user', methods=['POST'])
def createUser():
    data = request.get_json()

    if data.get("username") is not None and data.get("password") is not None:
        try:
            cursor.execute(''' 
                INSERT INTO USERS (username, password)
                VALUES (%s, %s)
            ''', (data['username'], data['password'] ))

            cursor.execute(''' 
                SELECT * FROM USERS
                WHERE username=%s
            ''', (data['username'], ))
            row = cursor.fetchone()

            return (jsonify({"userid": row[0], "username": row[1]}), 200)

        except Exception as e:
            return (jsonify({"message": str(e)}), 500)
    
    else:
        return (jsonify({"message": "Username and Password Required"}), 400)

@app.route('/delete_user/<username>', methods=['DELETE'])
def deleteUser(username):
    try:
        cursor.execute('''DELETE FROM USERS WHERE username=%s''', (username, ))
        return (jsonify({"message": "Deleted User"}), 200)
    except Exception as e:
        return (jsonify({"message": str(e)}), 400)

@app.route('/login', methods=['POST'])
def Login():
    data = request.get_json() #data is a dictionary 

    if data.get("username") is not None and data.get("password") is not None:
        try:
            cursor.execute('''
                SELECT * FROM users
                WHERE username=%s
            ''', (str(data["username"]),)) # for tuple put trailing comma to indicate only item in tuple

            row = cursor.fetchone()

            if row is None:
                raise Exception("Username: " + data["username"] + " Not Found")
            
            if data["password"] == row[2]:
                return(jsonify({"userID": row[0], "username": row[1]}))

            else:
                raise Exception("Invalid Password")

        
        except Exception as e:
            return (jsonify({"message": str(e)}), 404)

    else:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        return (jsonify({"message": "Invalid Request"}), 404)

@app.route('/create_folder', methods=['POST'])
def create_folder():
    data = request.get_json()

    if data.get("userID") is not None and data.get("name") is not None:
        try:
            cursor.execute(''' 
                INSERT INTO FOLDERS (userid, foldername)
                VALUES (%s, %s)
            ''', (data["userID"], data["name"] ))

            info = "Folder " + data["name"] + " Created"
            
            return (jsonify({"message": info}), 201)

        except Exception as e:
            return(jsonify({"message": str(e)}), 500)
    else:
        return(jsonify({"message": "Invalid Request"}), 400)

@app.route('/get_folders/<id>', methods=['GET'])
def get_folders(id):
    if id is not None:
        try:
            cursor.execute(''' 
                SELECT * FROM FOLDERS
                WHERE userid=%s
            ''', (int(id),))
            
            folders = []

            for row in cursor.fetchall():
                folders.append({"folderID": row[0], "folderName": row[2]})
            
            return (jsonify({"carts": folders}), 200)
        except Exception as e:
            return (jsonify({"message": str(e)}), 404)
    else:
        return (jsonify({"message": "No User ID"}), 404)

@app.route('/get_items/<folder_id>', methods=['GET'])
def get_items(folder_id):
    try:
        cursor.execute(''' 
            SELECT * FROM ITEMS
            WHERE folderid=%s
        ''', (int(folder_id),))

        items = []

        for row in cursor.fetchall():
            items.append({"itemID": row[0], "itemName": row[2], "itemPrice": row[3]})

        return (jsonify({"items": items}), 200)

    except Exception as e:
        return (jsonify({"message": str(e)}), 500)

@app.route('/update_folder', methods=['POST'])
def update_folder():
    data = request.get_json()

    if data.get("folderID") is not None and data.get("name") is not None:
        try:
            cursor.execute(''' 
                UPDATE FOLDERS
                SET foldername=%s
                WHERE folderid=%s
            ''', (data['name'], int(data['folderID'])))
 
            return (jsonify({"message": "Folder name has been updated"}), 200)

        except Exception as e:
            return (jsonify({"message": str(e)}), 501)
    else:
        return (jsonify({"message": "FolderID and New Name Are Required"}), 400)

@app.route('/delete_folder', methods=['DELETE'])
def delete_folder():
    data = request.get_json()

    if data.get("folderID") is not None:
        try:
            cursor.execute('''DELETE FROM ITEMS WHERE folderid=%s''', (data['folderID'], )) # First delete all items in the folder
            cursor.execute('''DELETE FROM FOLDERS WHERE folderid=%s''', (data['folderID'], )) # Then delete the folder

            return(jsonify({"message": "Folder Was Deleted"}), 200)
        except Exception as e:
            return(jsonify({"message": str(e)}), 500)
    else:
        return(jsonify({"message": "FolderID Required"}), 400)

@app.route('/create_item', methods=['POST'])
def create_item():
    data = request.get_json()

    if data.get('folderID') is not None and data.get('itemName') is not None and data.get('itemPrice') is not None:
        try:
            cursor.execute(''' 
                INSERT INTO ITEMS (folderid, itemname, itemprice)
                VALUES (%s, %s, %s)
            ''', (data['folderID'], data['itemName'], float(data['itemPrice'])) )

            return (jsonify({"message": "Item was created"}), 201)
        except Exception as e:
            return (jsonify({"message": str(e)}), 500)
    else:
        return (jsonify({"message": "folderID, itemName, and itemPrice are Required"}), 400)

@app.route('/update_item', methods=['POST'])
def update_item():
    data = request.get_json()

    if data.get('itemID') is not None and data.get('uName') is not None and data.get('uPrice') is not None:
        try:
            cursor.execute(''' 
                UPDATE ITEMS
                SET itemname=%s, itemprice=%s
                WHERE itemid=%s
            ''', (data['uName'], float(data['uPrice']), int(data['itemID']) ))

            return (jsonify({"message": "Item Updated"}), 200)

        except Exception as e:
            return (jsonify({"message": str(e)}), 500)

    else:
        return (jsonify({"message": "itemID, uName, and uPrice Required"}), 400)

@app.route('/delete_item', methods=['DELETE'])
def delete_item():
    data = request.get_json()

    if data.get('itemID') is not None:
        try:
            cursor.execute('''DELETE FROM ITEMS WHERE itemid=%s''', (data['itemID'], ))
            return (jsonify({"message": "Item Was Deleted"}), 200)
        except Exception as e:
            return (jsonify({"message": str(e)}), 500)
    else:
        return (jsonify({"message": "itemID is required"}), 400)


if __name__ == '__main__':
    app.run()
