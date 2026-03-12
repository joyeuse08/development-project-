from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('registration.html')

@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    email = request.form['email']
    # Here, you can add code to save the student information to a database or any other backend service.
    return redirect(url_for('success'))

@app.route('/success')
def success():
    return "Student registered successfully!"

if __name__ == "__main__":
    app.run(debug=True)