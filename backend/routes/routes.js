const memories = require('../store/memories');
const milestones = require('../store/milestones');
const myProfile = require('../store/profile');
const development = require('../store/development');

let firstEntry = true;

const router = app => {
  // memories
  app.get('/memories', (req, res) => {
    res.send(memories.getMemories())
  });

 app.get('/memories/:id', (req, res) => {
   const memoryId = parseInt(req.params.id);
   const memory = memories.getMemoryById(memoryId);

   res.send({
     memory
   })
 });

 app.post('/memories', (req, res) => {
   memories.addMemory(req.body);
   res.status(201).send('Added memory')
 });

  app.put('/memories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const memory = memories.getMemoryById(id);

    memories.updateMemory(memory, req.body.key, req.body.value)
    res.send(memory);
  });

// milestones
  app.get('/milestones', (req, res) => {
    res.send(milestones.getMilestones())
  });

  app.get('/milestones/:id', (req, res) => {
    const milestoneId = parseInt(req.params.id);
    const milestone = milestones.getMilestoneById(milestoneId);

    res.send({
      milestone
    })
  });

  app.post('/milestones', (req, res) => {
    console.log('posted milestone');
    milestones.addMilestone(req.body)
    res.status(201).send(`Added milestone`)
  });

  app.put('/milestones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const milestone = milestones.getMilestoneById(id);

    milestones.updateMilestone(milestone, req.body.key, req.body.value)
    res.send(milestone);
  });

  // profile
  app.get('/profile', (req, res) => {
    res.send(myProfile.getProfile())
  });

  app.post('/profile', (req, res) => {
    if (milestones.getMilestones().length === 0) {
      const milestone = {
        "title": "Birth",
        "id": 1,
        "date": req.body[1].value,
        "description": "Today I was born",
        "image": {
           "url": req.body[4].value,
        }, 
        "icon": "baby-carriage"
        }

        milestones.addMilestone(milestone);
        firstEntry = false;
    }
    if(development.getDevelopmentData().length === 0) {
      const devDataSet = [
        { "key": "date", "value": req.body[1].value },
        { "key": "length", "value": req.body[3].value },
        { "key": "weight", "value": req.body[2].value },
        { "key": "sex", "value": req.body[5].value },
         new Date()
      ]
      development.addDevelopmentData(devDataSet);
    }
    
    const profile = myProfile.getProfile();
    const data = req.body;
    for(let i = 0; i < data.length; i++) {
      myProfile.updateProfile(profile, data[i].key, data[i].value)
    }
    res.status(201).send(profile);
  });

  // development
  app.get('/development', (req, res) => {
    res.send(development.getDevelopmentData())
  });

  app.post('/development', (req, res) => {
    const dob = myProfile.getProfile().dob
    const data = req.body;
    data.push(dob)
    development.addDevelopmentData(data)
  })
};

module.exports = router;