import click
from flask_app.models import Users, UserData, db
from flask_app.authentication import auth
from flask_app.app import bcrypt, app


@click.command()
@click.option('--email', prompt='Enter your Email',
                help='This will be the superuser Email.')
@click.option('--fullname', prompt='Enter fullname for superuser',
                help='The fullname of the superuser.')
@click.option('--password', prompt='Enter your Password',
                help='This will be the superuser password.')
@click.option('--username', prompt='Enter your username',
                help='The username of the superuser.')
@click.option('--userage', prompt='Enter your age',
                help='The age of the superuser.')
@click.option('--usercity', prompt='Enter your city',
                help='The city of the superuser.')
def create_super_user(email, fullname, password, username, userage, usercity):
    """This function creates a superuser for the admin dashboard application with the id set to 0.
    
    :param email: this is gonna be the email id for the superuser
    :type email: str
    :param fullname: this is gonna be the fullname of the superuser
    :type fullname: str
    :param password: this is gonna be the password of the superuser
    :type password: str
    :param username: this is gonna be the username of the superuser
    :type password: str
    :param username: this is gonna be the userage of the superuser
    :type password: str
    :param username: this is gonna be the usercity of the superuser
    :type password: str

    :return: whether the superuser is created or not
    :rtype: str
    """
    with app.app_context():
        db.create_all()
        hashed_password = bcrypt.generate_password_hash(f'{password}').decode('utf-8')
        try:
            # newuser = UserData(id=0, username=username, userage=userage, usercity=usercity, usertype="superuser", email=email, password = hashed_password)
            # db.session.add(newuser)
            # db.session.commit()

            # No need to register superuser in firebase
            # register_firebase = auth.create_user_with_email_and_password(email, hashed_password)
            user = Users(id='0', email=email, fullname=fullname, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            userdata = UserData(username=username, userage=userage, usercity=usercity, usertype='superuser', users_id=user.id)
            db.session.add(userdata)
            db.session.commit()
            click.echo('SuperUser Created Successfully.')
        except:
            id = db.engine.execute(f"select * from users where id='0'").first()
            if id:
                click.echo('Failed to create superuser. Superuser already exists.')
            else:
                click.echo('Failed to create superuser. Enter valid data.')
