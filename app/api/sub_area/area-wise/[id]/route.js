import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {connectionStr} from "@/lib/db"
import {User} from "@/lib/model/users";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import path from "path";
import fs from "fs";
import { Agency } from "@/lib/model/agency";
import { uploadBase64Img } from "@/app/helper";
import { Area } from "@/lib/model/area";
import { SubArea } from "@/lib/model/sub_area";



export async function GET(request, content) {
    let result = [];
    try {
        const areaiId = content.params.id;
        const record = {area: areaiId, is_delete: 0};
        //return NextResponse.json({record, success: true});
        await mongoose.connect(connectionStr);
        const result = await SubArea.find(record);
        return NextResponse.json({result, success: true});
    } catch (error) {
        result = error;
    }
    return NextResponse.json(result);
}


