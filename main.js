import { loadModel, loadModelMetaData, analyzeText } from "./aiModel.js"


async function fetchYouTubeComments(videoId) {
  const instancesList = [
    'https://vid.puffyan.us',
    'https://inv.riverside.rocks',
    'https://y.com.sb',
    'https://invidious.tiekoetter.com'
  ]

  const response = await fetch(`${instancesList[Math.floor(Math.random() * instancesList.length)]}/api/v1/comments/${videoId}`)
  const data = await response.json()
  const comments = []
  for (const comment of data.comments) {
    comments.push({content: comment.content, author: comment.author})
  }

  return comments
}

async function main() {
  let model = null
  let modelMetadata = null
  try {
    model = await loadModel()
    modelMetadata = await loadModelMetaData()
  } catch {
    return 'unable to load model or/and its metadata'
  }
  
  const generateRatingBtn = document.getElementById('generateRatingBtn')
  generateRatingBtn.addEventListener('click', async () => {
    const youtubeSrc = document.getElementById('youtube-src').value

    if (youtubeSrc === '') {
      // TODO: do some error messaging here
      return
    }

    let videoId = ''

    if (youtubeSrc.includes('youtube')) {
      videoId = youtubeSrc.split('?v=')[1]
    } else if (youtubeSrc.includes('youtu.be')) {
      videoId = youtubeSrc.split('/')[1]
    } else {
      videoId = youtubeSrc
    }

    const comments = await fetchYouTubeComments(videoId)
    for (const comment of comments) {
      comment.score = await analyzeText(model, modelMetadata, comment.content)
    }
    
    console.log(comments)
  })

}

main()