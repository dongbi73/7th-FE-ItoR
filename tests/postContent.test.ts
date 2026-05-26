import test from 'node:test';
import assert from 'node:assert/strict';
import { sortByContentOrder } from '../src/utils/postContent.ts';
import { createPostRequestBody } from '../src/utils/postRequest.ts';

test('sortByContentOrder renders post contents by contentOrder', () => {
  const contents = [
    { contentOrder: 3, contentType: 'IMAGE', content: 'image.png' },
    { contentOrder: 1, contentType: 'TEXT', content: 'first text' },
    { contentOrder: 2, contentType: 'TEXT', content: 'second text' },
  ];

  assert.deepEqual(
    sortByContentOrder(contents).map((content) => content.contentOrder),
    [1, 2, 3],
  );
});

test('sortByContentOrder does not mutate the original response array', () => {
  const contents = [
    { contentOrder: 2, contentType: 'IMAGE', content: 'image.png' },
    { contentOrder: 1, contentType: 'TEXT', content: 'text' },
  ];

  sortByContentOrder(contents);

  assert.deepEqual(
    contents.map((content) => content.contentOrder),
    [2, 1],
  );
});

test('createPostRequestBody removes empty text blocks and reorders contents', () => {
  const requestBody = createPostRequestBody('title', [
    { id: '1', type: 'TEXT', value: 'first text' },
    { id: '2', type: 'TEXT', value: '   ' },
    { id: '3', type: 'IMAGE', value: 'image.png' },
    { id: '4', type: 'TEXT', value: ' second text ' },
  ]);

  assert.deepEqual(requestBody.contents, [
    { contentOrder: 1, contentType: 'TEXT', content: 'first text' },
    { contentOrder: 2, contentType: 'IMAGE', content: 'image.png' },
    { contentOrder: 3, contentType: 'TEXT', content: 'second text' },
  ]);
});
