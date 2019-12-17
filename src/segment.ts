import { invariant } from "ts-invariant";

export class Segment {
    constructor(public readonly offset: number, public readonly count: number) { }

    public overlaps(other: Segment): boolean {
        if (this.offset === other.offset) { return true; }
        const [first, second] = sortSegments([this, other]);
        return first.offset + first.count >= second.offset;
    }

    public split(at: number): [Segment, Segment] | [Segment] {
        if (at <= this.offset || at >= this.offset + this.count - 1) {
            return [new Segment(this.offset, this.count)];
        }
        const firstSegmentCount = at - this.offset;
        return [
            new Segment(this.offset, firstSegmentCount),
            new Segment(at, this.count - firstSegmentCount),
        ];
    }

    public subtract(other: Segment | undefined): Segment {
        if (!other) { return this; }
        return new Segment(this.offset + other.count, this.count - other.count);
    }

    public get end() {
        return this.offset + this.count;
    }
}

export function sortSegments<T extends Segment>(segments: T[]): T[] {
    return [...segments].sort((a, b) => a.offset - b.offset);
}