To deploy the database portion, or you can use the console.
```shell
sam deploy --stack-name serverless-mysql-blah --template db-stack.yml --parameter-overrides $(cat db-stack-parameters.cfg.mine) --capabilities CAPABILITY_IAM
```

For the Autoscaling group & ECS Cluster:

```shell script
sam deploy --stack-name serverless-ecs-autoscaling --template ecs-autoscaling-stack.yml --parameter-overrides $(cat ecs-autoscaling-parameters.cfg.mine) --capabilities CAPABILITY_IAM
``` 

Finally, for the app stack
```shell script
sam deploy --stack-name ff3-service-stack --template ffiii-app-stack.yml --parameter-overrides $(cat ffiii-app-stack-parameters.cfg.mine) --capabilities CAPABILITY_IAM
```