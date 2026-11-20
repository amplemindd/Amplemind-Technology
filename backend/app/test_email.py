import smtplib

EMAIL = "amplemindcontact@gmail.com"
PASSWORD = "eskorwhdmgslejjl"

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()

server.login(EMAIL, PASSWORD)

print("LOGIN SUCCESS")

server.quit()