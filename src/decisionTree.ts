import express from 'express';

interface Action {
  execute(): void;
}

class SendSMSAction implements Action {
  constructor(private phoneNumber: string) {}

  execute(): void {
    console.log(`Send SMS to: ${this.phoneNumber}`);
  }
}

class SendEmailAction implements Action {
  constructor(private sender: string, private receiver: string) {}

  execute(): void {
    console.log(`Send Email from ${this.sender} to ${this.receiver}`);
  }
}

class ConditionAction implements Action {
  constructor(
    private condition: string,
    private trueAction: Action | null,
    private falseAction: Action | null
  ) {}

  execute(): void {
    const result = eval(this.condition);
    if (result) {
      this.trueAction?.execute();
    } else {
      this.falseAction?.execute();
    }
  }
}

class LoopAction implements Action {
  constructor(private subtree: Action, private iterations: number) {}

  execute(): void {
    for (let i = 0; i < this.iterations; i++) {
      this.subtree.execute();
    }
  }
}

function deserializeAction(json: any): Action {
  switch (json.type) {
    case 'SendSMS':
      return new SendSMSAction(json.phoneNumber);
    case 'SendEmail':
      return new SendEmailAction(json.sender, json.receiver);
    case 'Condition':
      return new ConditionAction(
        json.condition,
        json.trueAction ? deserializeAction(json.trueAction) : null,
        json.falseAction ? deserializeAction(json.falseAction) : null
      );
    case 'Loop':
      return new LoopAction(deserializeAction(json.subtree), json.iterations);
    default:
      throw new Error(`Unknown action type: ${json.type}`);
  }
}

const app = express();
app.use(express.json());

app.post('/execute-tree', (req, res) => {
  try {
    const treeJson = req.body;
    const tree = deserializeAction(treeJson);
    tree.execute();
    res.status(200).send('Tree executed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error executing tree: ${error.message}`);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
