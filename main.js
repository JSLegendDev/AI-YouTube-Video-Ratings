const instancesList = [

]


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

async function main() {
  let model = null
  let modelMetadata = null
  try {
    model = await loadModel()
    modelMetadata = await loadModelMetaData()
  } catch {
    // TODO: Display an error message to the user
  }

  const generateRatingBtn = document.getElementById('generateRatingBtn')
  generateRatingBtn.addEventListener('click', () => {
    const youtubeSrc = document.getElementById('youtube-src').value

    let videoId = ''

    if (youtubeSrc.includes('youtube')) {
      videoId = youtubeSrc.split('?v=')[1]
    } else if (youtubeSrc.includes('youtu.be')) {
      videoId = youtubeSrc.split('/')[1]
    } else {
      videoId = youtubeSrc
    }



  })

}