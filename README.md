
## Purpose:
Vulnerabilities are getting increased every day. Therefore the need for prioritising patches are also increasing.In order to prioritise the patches, we need to assess the severity of the patches. CVE(Common Vulnerabilities and Exposures) provides a CVSS score from 1 to 10 for all the vulnerabilities and this is accepted as a standard mechanism to assess the severity of the vulnerabilities by a wide range of organisations and companies<br />
However, the CVSS Score is not sufficient to prioritize the patches since we also have to take into account the importance of host machine on which patch will be applied. Eg:  A patch for a software used in a front end server will not have the same priority as a patch for a software that is used in an internal tool.This importance is denoted as the environmental impact and it will take into consideration the location of the IP in network (e.g. internal or external server), the importance of services being run on it  , the availability of backups (load balancing) and many other factors. 
The purpose of this project is to get the environmental impact of the assets from the system administrator and prioritize the patches by combining the CVSS Score as well as the environmental impact and provide options to download reports in standard formats that could be easily integrated into a patch management tool.

##How to download and install the software
The web application is hosted in heroku in the url:
##### http://software-patch-management.herokuapp.com

Inorder to develop or extend the project follow the steps: 

### Download and Install Python
#####For Mac OS X
	  Download Python from https://www.python.org/downloads/mac-osx/.  
#####For Windows
	Download Python from https://www.python.org/downloads/windows/.
#####For other OS
	Download Python from https://www.python.org/downloads/. 

##### On Mac OS X
Install Homebrew<br />
	Open Terminal or your favorite OSX terminal emulator and run<br />
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"<br />
1.2.1.2 Set Environment Variable<br />
	Insert Homebrew directory at the top of PATH environment variable, by adding the following line at the bottom of ~./profile file.<br />
export PATH=/usr/local/bin:/usr/local/sbin:$PATH<br />
1.2.1.3 Install Python<br />
	Run <br />
$ brew install python<br />


##### On Windows
	Double click the downloaded installation file, which should be a MSI package, to install.


##### Download and Install Django
	Download from https://www.djangoproject.com/download/. 
	The latest official version is 1.9.
	Install with pip:
pip install Django==1.9
##### Download and Install PostgreSQL
	Download PostgreSQL from http://www.enterprisedb.com/products-services-training/pgdownload. 
	Open the downloaded package (.dmg for Mac OS X, and .exe for Windows) to install.

##### Reference:
[1] http://docs.python-guide.org/en/latest/starting/install/osx/<br />
[2] http://docs.python-guide.org/en/latest/starting/install/win/ <br />
[3] http://www.postgresql.org/download/ <br />

##How to use the software
We have created a admin and a non admin account with the following credentials:
#####Admin account:
######Username : admin
######Password : Admin123!

#####Non Admin account:
######Username : nonadmin 
######Password: Nonadmin123!

User can register for as many accounts they want to, then login using 
Username : admin
Password : Admin123!

and then approve the registered users as admin or non admin.
