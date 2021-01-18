import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from './config';
import { version } from '../package.json';
import { writeAPostWithCommentOnFacebook } from './facebook/writeAPostWithCommentOnFacebook';

const app = express();

// Note: Not using json because Integromat better works withs query string + raw text.
app.use(bodyParser.text());

app.get(['/', '/about'], (request, response) => {
    response.send({
        version,
    });
});

app.post('/post', async (request, response) => {
    // TODO: Add here some token to check identity of the request

    const postText = request.body;
    const commentText = request.query.commentText as string;

    if (!postText && !commentText && typeof postText !== 'string' && typeof commentText !== 'string') {
        response.status(400).send({ error: `You have not provided postText and commentText.` });
    }

    const { postUrl } = await writeAPostWithCommentOnFacebook({
        postText,
        commentText,
    });

    response.send({ postUrl });
});

app.listen(PORT, () => {
    console.info('██████████████████████████████████████████');
    console.info(`API is running at http://localhost:${PORT}`);
});
