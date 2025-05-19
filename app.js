const express=require('express');
app=express();
port=3000;
app
app.get('/',(req,res)=>{
  res.send('Hi there! I am a Simple Express Server!');
});
app.get('/about',(req,res)=>{
    res.send("I AM PRINSHU KUMAR WHO IS TRYING TO LEARN NODE JS AND EXPRESS JS");
});

app.get('/prity',(req,res)=>{
    res.send("I AM PRINSHU KUMAR WHO IS TRYING TO LEARN NODE JS AND EXPRESS JS with Prity");
});



app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server');
    console.log('You can also use the command "npm start" to run the server.');
    console.log('To stop the server, press Ctrl+C or close the terminal.');
    console.log('To restart the server, use the command "npm start" again.');
});
