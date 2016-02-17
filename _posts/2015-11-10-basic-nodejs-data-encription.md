---
layout: post
title: "Basic Data Encrypt and Decrypt in Nodejs"
date: 2015-11-10
tags: [nodejs]
image: /images/post/post-11.png
status: published
--- 

## Use Case

Let's say a customer ordered on your ecommerce site. You save his email on your database and send him an email too about his order information including a "cancel" link. In the cancel link structure, you added the orderid and encrypted email so you can decrypt and use those info later to verify in the database.

~~~javascript
// example cancel link
// http://www.myawesomestore.com/cancel/orderid/encrypted_email_address
~~~

There's a nodejs module called [crypto](https://nodejs.org/docs/latest/api/crypto.html) than can help us solve this issue


## Encripting the Email

We will use the ```Cipher``` class of Crypto module to encrypt data. ```crypto.createCipher()``` are used to create a new instance of Cipher. ```cipher.update()``` are used to update the content of the encrypted data. ```cipher.final()``` will be called in the end to close the encryption.

~~~javascript
const cipher = crypto.createCipher('aes192', 'superSecretKeyWhichIsBasicallyAnyStringYouWantOrBuffer'); 
var encrypted = cipher.update('myemail@address.com', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted); 
// eb0927cbcf4a1958857550437de5b1ba2ec41e6125f1e5f4078832ae4f255ab7
~~~

```createCipher``` accepts 2 parameters - algorithm and password. The algorithm is based on **OpenSSL** available cipher algorithms. The second parameter is the password which is used to derive the cipher key and initialization vector.

{:.mb0}
The result of the encrypted data will be a long and random string that looks like this 

~~~sh
eb0927cbcf4a1958857550437de5b1ba2ec41e6125f1e5f4078832ae4f255ab7
~~~

## Decripting the Email

Now when you received the encrypted email from the URL, create a ```Decipher``` instance and pass it as the first parameter in ```decipher.update```.

~~~javascript
var encrypted = req.params.encrypted_email_address;

const decipher = crypto.createDecipher('aes192', 'superSecretKeyWhichIsBasicallyAnyStringYouWantOrBuffer');  
var decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted); // myemail@address.com
~~~

## Conclusion

There are other methods available in ```crypto``` module and some wrappers available on ```npm``` and depending on what you want to achieve and how complicated the application is but the snippets above works fine for simple use cases.

Read the [crypto](https://nodejs.org/docs/latest/api/crypto.html) documentation to know more about the parameters used in the snippets.


