// Approved vocabulary-only corrections, independently checked against both old snapshots.
const assert=require('node:assert/strict');
const fixes=require('./fixtures/b1-vocabulary-corrections.json');
module.exports=function normalizeB1Vocabulary(lesson){
 const clone=JSON.parse(JSON.stringify(lesson));
 for(const fix of fixes[clone.id]??[]){const vocab=clone.sentences[fix.index].vocabulary[0];assert.equal(vocab.word,fix.word,`${clone.id} correction word`);assert.equal(vocab.meaning,fix.new,`${clone.id} corrected meaning`);vocab.meaning=fix.old;}
 return clone;
};
