import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  })
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    setIsUploading(true)
    const { secure_url, height, width } = await uploadService.uploadImg(ev)
    setImgData({ imgUrl: secure_url, width, height })
    setIsUploading(false)
    onUploaded && onUploaded(secure_url)
  }

  function getUploadLabel() {
    // if (imgData.imgUrl) return 'Upload Another?'
    if (imgData.imgUrl) return ''
    return isUploading ? 'Uploading....' : 'Upload picture'
  }

  return (
    <div className="upload-preview">
      {imgData.imgUrl && <img src={imgData.imgUrl} style={{ maxWidth: '7em', float: 'right' }} />}
      <label htmlFor="imgUpload">{getUploadLabel()}</label>
      <input className="img-upload-input" type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
    </div>
  )
}