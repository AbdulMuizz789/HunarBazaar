const express = require('express');
const {createWorker} = require('tesseract.js');
const router = express.Router();
router.post(' /extract-text', async (req,res) => {
    const { imgUrl } = req.body;
    const worker = await createWorker('eng');
    try{
        const result = await worker.recognize(imageUrl);
        res.json({text: result.data.text});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
    finally{
        await worker.terminate();
    }
});

module.exports = router;