import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
      const token = jwt.sign({userId}, process.env.JWT_SECRET, 
        {expiresIn: '10d'}); //Cookie will expire in 10 days from the time it is set on the client side 

        res.cookie("jwt",token,{
            maxAge: 7 * 24 * 60 * 60* 1000,
            httpOnly: true, //prevent XSS attacks by not allowing the client side to access the cookie
            sameSite:"strict", //prevent CSRF attacks by ensuring that the cookie is sent only to the same site that set it
            secure:process.env.NODE_ENV === "development",
        });

        return token;
};