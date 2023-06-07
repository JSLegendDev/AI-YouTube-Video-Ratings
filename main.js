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

async function analyzeText(text) {
  let model = null
  let modelMetadata = null
  try {
    model = await loadModel()
    modelMetadata = await loadModelMetaData()
  } catch {
    return 'unable to load model or/and its metadata'
  }
  
  const OOV_INDEX = 2 // Index for words that are not in the vocabulary
  const textNoPunctuation = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ')
  const sequence = []
  for (const word of textNoPunctuation) {
    const wordIndex = modelMetadata.wordIndex[word]
    let finalWordIndex
    if (!wordIndex) {
      finalWordIndex = OOV_INDEX
    } else {
      // indexFrom insure that the wordIndex aligns with the pretrained model vocabulary
      finalWordIndex = wordIndex + modelMetadata.indexFrom
    }

    if (finalWordIndex > modelMetadata.vocabularySize) {
      finalWordIndex = OOV_INDEX
    }

    sequence.push(finalWordIndex)
  }

  //pad sequence with 0s if not full.
  if (sequence.length > modelMetadata.maxLen) {
    sequence.splice(0, sequence.length - modelMetadata.maxLen)
  }

  if (sequence.length < modelMetadata.maxLen) {
    const nbOfPaddingNeeded = modelMetadata.maxLen - sequence.length
    for (let i = 0; i < nbOfPaddingNeeded; i++) {
      sequence.unshift(0)
    }
  }

  const input = tf.tensor2d(sequence, [1, modelMetadata.maxLen])
  const predictOutput = model.predict(input)
  const score = predictOutput.dataSync()[0]
  
  // freeing memory. Required when working with tensorflow.js
  predictOutput.dispose()
  input.dispose()

  return score
}

async function fetchYouTubeComments(videoId) {
  const instancesList = [
    'https://vid.puffyan.us',
    'https://inv.riverside.rocks',
    'https://y.com.sb',
    'invidious.tiekoetter.com'
  ]

  const response = await fetch(`${instancesList[Math.floor(Math.random() * instancesList.length)]}/api/v1/comments/${videoId}`)
  const data = await response.json()
  console.log(data)
}

async function main() {
  
  const generateRatingBtn = document.getElementById('generateRatingBtn')
  generateRatingBtn.addEventListener('click', async () => {
    console.log('test')

    const youtubeSrc = document.getElementById('youtube-src').value

    let videoId = ''

    if (youtubeSrc.includes('youtube')) {
      videoId = youtubeSrc.split('?v=')[1]
    } else if (youtubeSrc.includes('youtu.be')) {
      videoId = youtubeSrc.split('/')[1]
    } else {
      videoId = youtubeSrc
    }

    fetchYouTubeComments(videoId)
  })

}

main()