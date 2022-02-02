import { Client, createClient } from './client';
import * as Storage from './storage';
import * as Contract from './contract/';

export class Team {
	/** team image */
	public image?: string;
	/** team friendly name. */
	public name?: string;
	/** short description of the team. */
	public description?: string;
	/** link to the team website. */
	public external_url?: string;
}

export class Project {
	/** project image */
	public image?: string;
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public description?: string;
	/** link to the project website. */
	public external_url?: string;
}

export class Release {
	/** project image */
	public image?: string;
	/** full release name. */
	public name?: string;
	/** short description of the release. */
	public description?: string;
	/** link to the release website. */
	public external_url?: string;
	/** mapping of names to artifacts. */
	public artifacts?: Map<string, Artifact>;
}

export class Artifact {
	/** OS platform architecture */
	public architecture?: string
	/** SHA256 hash of the file. */
	public sha256?: string;
	/** path to the artifact file. */
	public provider?: string;
}

/**
 * Replacer is used to correctly serialize fields to JSON.
 */
export function replacer(key: any, value: any): any {
  if (key === 'artifacts') {
    return Object.fromEntries(value);
  }
  return value;
}

/**
 * Reviver is used to correctly deserialize fields from JSON.
 */
export function reviver(key: any, value: any): any {
	if (key === 'artifacts') {
		return new Map<string, Artifact>(Object.entries(value));
	} 
	return value;
}

export { Client, Storage, Contract, createClient };