const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/moderate-text', require('./routes/textModeration'));
app.use('/moderate-image', require('./routes/imageModeration'));
app.use('/moderate-audio', require('./routes/audioModeration'));

app.get('/',(req,res)=>{
    res.send({
        activeStatus:true,
        error:false,
    })
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
