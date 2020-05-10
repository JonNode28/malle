import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import React  from "react";

export default function DefaultError({ err }: ErrorRendererProps){
  if(typeof err === 'string') return <div data-testid='error'>error: {err}</div>;
  else if('message' in err) return <div data-testid='error'>error: {err.message}</div>;
  return <div data-testid='error'>error: unreadable error</div>;
}