async function loadModel() {
    return await tf.loadLayersModel(
     'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json'
    )
}

async function loadModelMetaData() {
    const metaData = await (await fetch('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json')).json()
    return {
      maxLen: metaData['max_len'],
      indexFrom: metaData['index_from'],
      wordIndex: metaData['word_index'],
      vocabularySize: metaData['vocabulary_size']
    }
}