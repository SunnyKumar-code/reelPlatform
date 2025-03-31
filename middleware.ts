import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname}=req.nextUrl
                //allow auth related routes
                if(
                    pathname.startsWith("/api/auth")||
                    pathname==="/login"||
                    pathname==="/register"
                ){
                    return true
                }
                //public
                if(pathname==="/"|| pathname.startsWith("/api/videos")){
                    return true
                }
                return !!token

            }
        }
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth.js paths)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api/auth|_next/static|_next/image|_next/data|favicon.ico|public/).*)'
    ],
}