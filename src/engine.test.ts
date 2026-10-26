import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {parseContent} from './content';
import {createGame,reducer,shuffle} from './engine';
const raw=readFileSync('content/decks.toml','utf8');const deck=parseContent(raw).decks[0];
describe('memory game',()=>{
 it('creates two distinct cards per pair and shuffles without losing items',()=>{const state=createGame(deck);expect(state.cards).toHaveLength(12);expect(new Set(state.cards.map(c=>c.id)).size).toBe(12);for(const p of deck.pairs)expect(state.cards.filter(c=>c.pairId===p.id)).toHaveLength(2);const items=[1,2,3,4];expect(shuffle(items,()=>0)).toEqual([2,3,4,1]);expect(items).toEqual([1,2,3,4]);});
 it('blocks extra clicks on mismatch until explicit continue',()=>{let s=createGame(deck);const a=s.cards[0];const b=s.cards.find(c=>c.pairId!==a.pairId)!;s=reducer(reducer(s,{type:'flip',id:a.id}),{type:'flip',id:b.id});expect(s.phase).toBe('mismatch');expect(s.attempts).toBe(1);expect(reducer(s,{type:'flip',id:s.cards[3].id})).toBe(s);s=reducer(s,{type:'hide'});expect(s.flipped).toEqual([]);expect(s.phase).toBe('playing');});
 it('does not count repeated clicks or unknown cards',()=>{let s=createGame(deck);expect(reducer(s,{type:'flip',id:'unknown'})).toBe(s);s=reducer(s,{type:'flip',id:s.cards[0].id});expect(reducer(s,{type:'flip',id:s.cards[0].id})).toBe(s);expect(s.attempts).toBe(0);});
 it('keeps matched cards after an incorrect answer and finishes only after all six answers',()=>{let s=createGame(deck);for(let i=0;i<deck.pairs.length;i++){const pair=deck.pairs[i];const cards=s.cards.filter(c=>c.pairId===pair.id);for(const c of cards)s=reducer(s,{type:'flip',id:c.id});expect(s.phase).toBe('question');expect(reducer(s,{type:'hide'})).toBe(s);expect(reducer(s,{type:'answer',option:0,optionCount:3})).toBe(s);s=reducer(s,{type:'answer',option:pair.question.answer===1?2:1,optionCount:3});expect(s.matched).toContain(pair.id);expect(s.phase).toBe(i===5?'finished':'playing');expect(reducer(s,{type:'flip',id:cards[0].id})).toBe(s);}expect(Object.keys(s.answers)).toHaveLength(6);expect(s.attempts).toBe(6);});
});
describe('editorial validation',()=>{
 it('accepts the demonstration deck',()=>expect(parseContent(raw).decks).toHaveLength(1));
 it('rejects missing pairs, duplicate ids, bad answers and unlabelled images',()=>{const config=()=>parseContent(raw);let c=config();c.decks[0].pairs.pop();expect(()=>parseContentFromObject(c)).toThrow();c=config();c.decks[0].pairs[1].id=c.decks[0].pairs[0].id;expect(()=>parseContentFromObject(c)).toThrow();c=config();c.decks[0].pairs[0].question.answer=10;expect(()=>parseContentFromObject(c)).toThrow();c=config();c.decks[0].pairs[0].reference.image='images/test.webp';expect(()=>parseContentFromObject(c)).toThrow();});
 it('rejects external image URLs and path traversal',()=>{for(const image of ['https://tracker.example/image.png','images/../file.png']){const c=parseContent(raw);c.decks[0].pairs[0].reference.image=image;c.decks[0].pairs[0].reference.alt='Test';expect(()=>parseContentFromObject(c)).toThrow();}});
});
import {collectionSchema} from './content';
function parseContentFromObject(value:unknown){return collectionSchema.parse(value);}
