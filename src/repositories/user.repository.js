import User from "../models/user.model.js"


class UserRepository {
    static async getById(id){
        const user = await User.findOne({_id : id})
        return user
    }

    static async getByEmail(email){
        const user = await User.findOne({email})
        return user
    }

    static async SaveUser(user){
        return await user.save()
    }

    static async setUserVerified(value){
        const user = await UserRepository.getById(user_Id)
        user.emailVerified = value
        await UserRepository.SaveUser(user)
    }
}

export default UserRepository