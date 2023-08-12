import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {

    /**
     * Uploads an image file to Cloudinary
     * @param {Express.Multer.File} file - The image file to be uploaded
     * @returns {Promise<UploadApiResponse | UploadApiErrorResponse>} - The Cloudinary upload response
     */
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        // Create a new Promise to handle the asynchronous upload
        return new Promise((resolve, reject) => {

            // Create a new upload stream with a callback to handle the result or error
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            // Convert the buffer of the file to a stream and pipe it to the upload stream
            toStream(file.buffer).pipe(upload);
        });
    }
}
