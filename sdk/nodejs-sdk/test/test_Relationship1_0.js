/* eslint-env mocha */
'use strict'
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
// const Context = require('../src/utils/Context')
const Relationship = require('../src/protocols/v1_0/Relationship')

const forRelationship = 'RxRJCMe5XNqc9e9J1YPwhL'
const threadId = '7a80285e-896c-45f6-b386-39ed7c49230c'
const label = 'test label'
const logoUrl = 'http://test.logo/url'
const shortInvite = true

describe('Relationship', () => {
  it('should init correctly', async () => {
    const rel = new Relationship(
      forRelationship,
      threadId,
      label,
      logoUrl
    )
    expect(rel.threadId).to.equal(threadId)
    expect(rel.forRelationship).to.equal(forRelationship)
    expect(rel.label).to.equal(label)
    expect(rel.logoUrl).to.equal(logoUrl)
  })

  it('should build CREATE msg correctly without profile url', async () => {
    const rel = new Relationship(
      null,
      threadId,
      label
    )
    const msg = await rel.createMsg(null)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.CREATE}`
    )
    expect(msg['~thread'].thid).to.equal(threadId)
    expect(msg.label).to.equal(label)
    expect(msg.logoUrl).to.an('undefined')
  })

  it('should build CREATE msg correctly with profile url', async () => {
    const rel = new Relationship(
      null,
      threadId,
      label,
      logoUrl
    )
    const msg = await rel.createMsg(null)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.CREATE}`
    )
    expect(msg['~thread'].thid).to.equal(threadId)
    expect(msg.label).to.equal(label)
    expect(msg.logoUrl).to.equal(logoUrl)
  })

  it('should build INVITATION msg correctly', async () => {
    const rel = new Relationship(
      forRelationship,
      threadId
    )
    const msg = await rel.connectionInvitationMsg(null)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.CONNECTION_INVITATION}`
    )
    expect(msg['~for_relationship']).to.equal(forRelationship)
    expect(msg['~thread'].thid).to.equal(threadId)
  })
  it('should build INVITATION msg with shortInvite correctly', async () => {
    const rel = new Relationship(
      forRelationship,
      threadId
    )
    const msg = await rel.connectionInvitationMsg(null, shortInvite)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.CONNECTION_INVITATION}`
    )
    expect(msg['~for_relationship']).to.equal(forRelationship)
    expect(msg['~thread'].thid).to.equal(threadId)
    expect(msg.shortInvite).to.equal(shortInvite)
  })
  it('should build OutOfBand invitation msg correctly', async () => {
    const rel = new Relationship(
      'RxRJCMe5XNqc9e9J1YPwhL',
      '7a80285e-896c-45f6-b386-39ed7c49230c'
    )
    const msg = await rel.outOfBandInvitationMsg(null)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.OUT_OF_BAND_INVITATION}`
    )
    expect(msg.goalCode).to.equal('p2p-messaging')
    expect(msg.goal).to.equal('To establish a peer-to-peer messaging relationship')
  })
  it('should build OutOfBand invitation msg with shortInvite correctly', async () => {
    const rel = new Relationship(
      'RxRJCMe5XNqc9e9J1YPwhL',
      '7a80285e-896c-45f6-b386-39ed7c49230c'
    )
    const msg = await rel.outOfBandInvitationMsg(null, shortInvite)
    expect(msg['@type']).to.equal(
     `${rel.msgQualifier};spec/${rel.msgFamily}/${rel.msgFamilyVersion}/${rel.msgNames.OUT_OF_BAND_INVITATION}`
    )
    expect(msg.goalCode).to.equal('p2p-messaging')
    expect(msg.goal).to.equal('To establish a peer-to-peer messaging relationship')
    expect(msg.shortInvite).to.equal(shortInvite)
  })
})
