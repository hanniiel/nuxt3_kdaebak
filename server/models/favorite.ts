import mongoose from 'mongoose'
import IFavorite from '~~/interfaces/IFavorite'
const { Schema, model } = mongoose

const schema = new Schema<IFavorite>(
    {
        source: {
            type: String,
            required: true,
            index: true,
        },
        post: {
            type: String,
            required: true,
            index: true,
        },
        image: String,
        title: String,
        content: String,
        user: {
            type: String,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

const Favorite = model<IFavorite>('Favorite', schema)

export { Favorite, schema }
