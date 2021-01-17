import { writeAPostWithCommentOnFacebook } from './facebook/writeAPostWithCommentOnFacebook';

async function main() {
    const postText = `test ${Math.random()}`;
    const commentText = `test comment ${Math.random()}`;

    const { postUrl } = await writeAPostWithCommentOnFacebook({ postText, commentText });

    console.log({ postUrl });
    return { postUrl };
}

main();
