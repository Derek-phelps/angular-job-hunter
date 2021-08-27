module.exports = {
  name: 'candidate',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/candidate',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
