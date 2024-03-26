import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Agency } from "@/lib/model/agency";
import { User } from "@/lib/model/users";
import { connectionStr } from "@/lib/db";
import bcrypt from 'bcrypt';
import validator from 'validator';
import { uploadBase64Img } from "@/app/helper";
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

export async function GET(){
 
    let data=[];
    try{
        console.log(connectionStr);
        await mongoose.connect(connectionStr);
        data = await Agency
        .find({is_delete:0}).sort({ created_at: -1 });
    }
    catch(error)
    {
        data={success:false,error:error.message};
    }

    return NextResponse.json({result:data,success:true});
}
export async function POST(request) {
    try {
        const payload = await request.json();

        await mongoose.connect(connectionStr);

        const record = {agency_email: payload.agency_email,is_delete:0};
        const is_findEmail = await Agency.findOne(record);
        if (is_findEmail) {
            return NextResponse.json({msg: 'agency is already present',success:false}, {status: 409});
        }
  const image = payload.agency_logo;

        const imageBuffer = Buffer.from(image.split('base64,')[1], 'base64');
        // Generate a unique filename
        const filename = `${uuidv4()}.jpg`;
        // Define the path to save the image in a temporary directory
        const tempDir = 'temp';
        // Ensure the parent directory exists, create it if not
        await fs.mkdir(path.dirname(tempDir), { recursive: true });
        // Construct the full path to save the image
        const imagePath = path.resolve(tempDir, filename);
        // Write the image buffer to disk
        await fs.writeFile(imagePath, imageBuffer);
     return NextResponse.json({ error:filename, success: false });
        if(payload.agency_logo)
        {
            try {
                payload.agency_logo = await uploadBase64Img(payload.agency_logo);
            } catch (e) {
                return NextResponse.json({e, success: 'img upload error found'});
            }
        }
      

        //agency create
        let agency = new Agency(payload);
        let result = await agency.save();
        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    } finally {
        await mongoose.disconnect();
    }
}
