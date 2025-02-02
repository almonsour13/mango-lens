
import { sign, verify } from "jsonwebtoken";
import { jwtVerify } from "jose"

export const checkTokenExpiration = async (token: string) => {
    try {
        const secraet = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const secret = process.env.JWT_SECRET_KEY;
        // Verify and decode the token
        console.log(secraet)
        if (!secret) return null;
        // const { payload } = await verify(token, secret);
        return { valid: true, token:"" };
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            console.log("Token has expired");
            return { valid: false, error: "Token expired" };
        }
        console.log("Invalid token:", error);
        return { valid: false, error: "Invalid token" };
    }
};
