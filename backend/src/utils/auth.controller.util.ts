import prisma from "../db/prisma.js";


export default function genprofilepic(fullName:string)    
{
    const profilepicture=`https://avatar.iran.liara.run/username?username=`
    const firstname:string=fullName.split(" ")[0];
    const lastname:string=fullName.split(" ")[1];
    let result:string=profilepicture+firstname;
    if(lastname) result=result+"+"+lastname;
    return result;

}






    
