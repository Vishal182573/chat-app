export {default} from "next-auth/middleware" // this will protect all the next pages , i.e after loading the sign in page appears automatically

export const config = {matcher:["/"]} // this is list of cutom routes which needs authentication 