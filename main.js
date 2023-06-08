import { loadModel, loadModelMetaData, analyzeText } from "./aiModel.js"


async function fetchYouTubeComments(videoId) {
  const instancesList = [
    'https://vid.puffyan.us',
    'https://inv.riverside.rocks',
    'https://y.com.sb',
    'https://invidious.tiekoetter.com',
    'https://inv.bp.projectsegfau.lt',
    'https://invidious.flokinet.to',
    'https://yt.artemislena.eu',
    'https://iv.melmac.space',
    'https://invidious.snopyta.org',
    'https://iv.ggtyler.dev'
  ]

  const comments = []
  let firstFetch = true
  let continuation = null
  while (comments.length < 100) {
    const selectedInstance = instancesList[Math.floor(Math.random() * instancesList.length)]

    if (firstFetch) {
      const response = await fetch(`${selectedInstance}/api/v1/comments/${videoId}?sort_by=top`)
      const data = await response.json()
      for (const comment of data.comments) {
        comments.push({content: comment.content, author: comment.author})
      }

      continuation = data.continuation
      firstFetch = false
      continue

    } 

    if (!continuation) {
      break
    }

    const response = await fetch(`${selectedInstance}/api/v1/comments/${videoId}?sort_by=top&continuation=${continuation}`)
    const data = await response.json()
    console.log(data)
    for (const comment of data.comments) {
      comments.push({content: comment.content, author: comment.author})
    }

    continuation = data.continuation

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
    let videoRating = 0
    for (const comment of comments) {
      comment.score = await analyzeText(model, modelMetadata, comment.content)
      if (comment.score >= 0.5) {
        videoRating += 1
      }
    }
    
    videoRating = ((videoRating / comments.length) + 0.10) * 100
    console.log(videoRating)
    console.log(comments)
  })

}

main()