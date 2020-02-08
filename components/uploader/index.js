import { isImageFile, isVideo } from './utils';
Component({
  properties: {
    src:String,
    disabled: Boolean,
    multiple: Boolean,
    uploadText: String,
    useBeforeRead: Boolean,
    previewSizeW: {
        type: String,
        value: "300rpx"
    },
    ossStyle:{
      type: String,
      value: ""
    },
    previewSizeH: {
      type: String,
      value: "300rpx"
    },
        name: {
            type: [Number, String],
            value: ''
        },
        accept: {
            type: String,
            value: 'image'
        },
        sizeType: {
            type: Array,
            value: ['original', 'compressed']
        },
        capture: {
            type: Array,
            value: ['album', 'camera']
        },
        fileList: {
            type: Array,
            value: []
        },
        maxSize: {
            type: Number,
            value: Number.MAX_VALUE
        },
        maxCount: {
            type: Number,
            value: 100
        },
        deletable: {
            type: Boolean,
            value: true
        },
        previewClass:{
          type: String,
          value: ''
        },
        previewImage: {
            type: Boolean,
            value: true
        },
        previewFullImage: {
            type: Boolean,
            value: true
        },
        imageFit: {
            type: String,
            value: 'scaleToFill'
        },
        camera: {
            type: String,
            value: 'back'
        },
        compressed: {
            type: Boolean,
            value: true
        },
        maxDuration: {
            type: Number,
            value: 60
        }
    },
    data: {
        computedPreviewSize: '',
        isInCount: true,
    },
    methods: {
        emit(name,data){
            // 自定义组件传值
            this.triggerEvent(name, data)
        },
        startUpload() {
            if (this.data.disabled)
                return;
            const { name = '', capture, maxCount, multiple, maxSize, accept, sizeType, fileList, camera, compressed, maxDuration, useBeforeRead = false // 是否定义了 beforeRead
             } = this.data;
            let chooseFile = null;
            const newMaxCount = maxCount - fileList.length;
            // 设置为只选择图片的时候使用 chooseImage 来实现
            if (accept === 'image') {
                chooseFile = new Promise((resolve, reject) => {
                    wx.chooseImage({
                        count: multiple ? (newMaxCount > 9 ? 9 : newMaxCount) : 1,
                        sourceType: capture,
                        sizeType,
                        success: resolve,
                        fail: reject
                    });
                });
            }
            else if (accept === 'video') {
                chooseFile = new Promise((resolve, reject) => {
                    wx.chooseVideo({
                        sourceType: capture,
                        compressed,
                        maxDuration,
                        camera,
                        success: resolve,
                        fail: reject
                    });
                });
            }
            else {
                chooseFile = new Promise((resolve, reject) => {
                    wx.chooseMessageFile({
                        count: multiple ? newMaxCount : 1,
                        type: 'file',
                        success: resolve,
                        fail: reject
                    });
                });
            }
            chooseFile
                .then((res) => {
                let file = null;
                if (isVideo(res, accept)) {
                    file = Object.assign({ path: res.tempFilePath }, res);
                }
                else {
                    file = multiple ? res.tempFiles : res.tempFiles[0];
                }
                // 检查文件大小
                console.log(file)
                if (file instanceof Array) {
                    const sizeEnable = file.every(item => item.size <= maxSize);
                    if (!sizeEnable) {
                        console.log("orver")
                        this.$emit('oversize', { name });
                        return;
                    }
                }
                else if (file.size > maxSize) {
                    console.log("orver")
                    this.$emit('oversize', { name });
                    return;
                }
                // 触发上传之前的钩子函数
                if (useBeforeRead) {
                    this.$emit('before-read', {
                        file,
                        name,
                        callback: (result) => {
                            if (result) {
                                // 开始上传
                                this.$emit('after-read', { file, name });
                            }
                        }
                    });
                }
                else {
                    this.emit('after-read', { file, name });
                }
            }).catch(error => {
                console.log(error)
                this.$emit('error', error);
            });
        },
        deleteItem(event) {
            const { index } = event.currentTarget.dataset;
            this.emit('delete', { index, name: this.data.name });
        },
        // 大图预览
        doPreviewImage(event) {
            const curUrl = event.currentTarget.dataset.url;
            const images = this.data.fileList
                .filter(item => item.isImage)
                .map(item => item.url || item.path);
            this.emit('click-preview', { url: curUrl, name: this.data.name });
            wx.previewImage({
                urls: images,
                current: curUrl,
                fail() {
                    wx.showToast({ title: '预览图片失败', icon: 'none' });
                }
            });
        }
    }
});
