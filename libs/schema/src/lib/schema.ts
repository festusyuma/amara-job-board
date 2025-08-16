import { App, Controller, HttpMethod, Route } from '@fy-tools/rpc-server';
import { z } from 'zod/mini';

export const Schema = new App()
  .controller(
    new Controller('job-board')
      .route(
        new Route('/', HttpMethod.POST)
          .body(
            z.object({
              name: z.string(),
              description: z.string(),
            })
          )
          .response(z.object({ success: z.boolean() }))
          .authorized()
      )
      .route(
        new Route('/', HttpMethod.GET)
          .response(
            z.object({
              data: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string(),
                })
              ),
              total: z.number(),
            })
          )
          .authorized()
      )
  )
  .controller(
    new Controller('chat')
      .route(
        new Route('', HttpMethod.POST).body(
          z.object({ id: z.optional(z.string()), message: z.string() })
        )
      )
      .route(
        new Route('', HttpMethod.GET).body(
          z.array(z.object({ id: z.string(), title: z.string() }))
        )
      )
      .route(
        new Route('/:id', HttpMethod.GET)
          .params(z.object({ id: z.string() }))
          .body(
            z.array(
              z.object({
                id: z.string(),
                messages: z.array(
                  z.object({ message: z.string(), id: z.string() })
                ),
              })
            )
          )
      )
  );
