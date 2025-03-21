import csv
import mysql.connector
import json

# Connect to MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='mydb'
)
cursor = conn.cursor()

# Open and read CSV file
csv_file = 'productsDB.csv'
with open(csv_file, mode='r', newline='', encoding='latin1') as file:
    reader = csv.DictReader(file, delimiter=';')
    for row in reader:
        # Combine image-related columns into productImg as JSON array
        image_data = {
            'image_url': row['image_url'],
            'variation_0_thumbnail': row['variation_0_thumbnail'],
            'variation_0_image': row['variation_0_image'],
            'variation_1_thumbnail': row['variation_1_thumbnail'],
            'variation_1_image': row['variation_1_image']
        }
        row['productImg'] = json.dumps(image_data)

        # Prepare SQL query
        sql = """
            INSERT INTO product (category, productName, price, productImg)
            VALUES (%s, %s, %s, %s)
        """
        # Execute SQL query
        cursor.execute(sql, (row['category'], row['name'], row['raw_price'], row['productImg']))
# Commit changes and close connection
conn.commit()
conn.close()
