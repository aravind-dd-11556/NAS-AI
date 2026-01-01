import reasons from '../reasons.json';
import reasonsTa from '../reasons_ta.json';

export const classicExcuses = reasons as string[];
export const classicExcusesTa = reasonsTa as string[];

export function getClassicExcuse(language: string = "English"): string {
    const list = language === "Tamil" ? classicExcusesTa : classicExcuses;
    return list[Math.floor(Math.random() * list.length)];
}
