import { viewConfig } from "../../configs/view.config"

export const showFile = (file:string) => {
    return {
        url: `${viewConfig.baseUrlVideos}/${file}`
    }
}

export const getUserKeyName = (userId: string):string =>{
    return `user:${userId}`
}