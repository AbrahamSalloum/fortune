from setuptools import setup

setup(
    name='fortune-server',
    version='1.0',
    long_description=__doc__,
    packages=['fortune-server'],
    include_package_data=True,
    zip_safe=False,
    install_requires=['Flask>=1.1', 'pymongo', 'flask_jwt_extended', 'requests']
)