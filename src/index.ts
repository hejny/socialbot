import bodyParser from 'body-parser';
import express from 'express';
import { version } from '../package.json';
import { PORT, TOKEN } from './config';
import { writeAPostWithCommentOnFacebook } from './facebook/writeAPostWithCommentOnFacebook';

const app = express();

// Note: Not using json because Integromat better works withs query string + raw text.
app.use(bodyParser.text());

app.get(['/', '/about'], (request, response) => {
    return response.send({
        version,
    });
});

app.post('/post', async (request, response) => {
    if (TOKEN && request.query.token !== TOKEN) {
        return response.status(403).send({ error: `Wrong token.` });
    }

    const postText = request.body;
    const commentText = request.query.commentText as string | undefined;

    try {
        const { postUrl } = await writeAPostWithCommentOnFacebook({
            postText,
            commentText,
        });

        return response.send({ postUrl });
    } catch (error) {
        response.status(500).send({ error: `Something went wrong.` });
        throw error;
    }
});

app.listen(PORT, () => {
    console.info('██████████████████████████████████████████');
    console.info(`API is running at http://localhost:${PORT}`);
});
