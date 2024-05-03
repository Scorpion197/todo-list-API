import requests 

endpoint = "http://localhost:3000/authentication/register"

data = {
    "email": "kamelgaouaoui197@gmail.com", 
    "password": "password123"
}

response = requests.post(endpoint, json=data)
print(response.json())