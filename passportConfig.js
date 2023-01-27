const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const User = require('./models/users')
exports.initializingPassport = (passport)=>{

    passport.use(new LocalStrategy({
        usernameField:'username',
        passwordField:'password'
    },
    async function (username,password,done){
        try {
            const user = await User.findOne({username});
        if (!user ) return done(null,false);
        const isMatch = await user.matchPassword(password);
        if (! isMatch) return done(null, false)
        return done(null,user)
        }
        catch (error) {
            return done(error,false)
        }

    }));
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })

    passport.deserializeUser( async (id,done)=>{
        try{
            const user  = await User.findById(id);
            done(null, user)

        }
        catch(error){
            done(error,false)
        }
    })


};

